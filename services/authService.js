const encrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const APP_PORT = process.env.APP_PORT;
const APP_HOST = process.env.APP_HOST;

const UserRepository = require("../repositories/userRepository");
const userRepository = new UserRepository();

class AuthService {
  async #secretKey() {
    const secretKey = process.env.JWT_SECRET_KEY;
    return secretKey;
  }
  async #encrypt(password, saltRounds) {
    const salt = await encrypt.genSalt(saltRounds);
    return await encrypt.hash(password, salt);
  }
  async #checkPassword(userPassword, dbPassword) {
    return await encrypt.compare(userPassword, dbPassword);
  }
  async #sendEmail(user) {
    try {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await nodemailer.createTestAccount();
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: user?.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `
        <h1>Hello, ${user?.username}</h1> <br>
        <div>this is your confirmation email</div>
        <div>please click this link below</div>
        <a href="http://${APP_HOST}:${APP_PORT}/auth/verify/${user?.verifiedToken}" target="_blank" rel="noopener noreferrer">Verify Your Email</a>
        `, // html body with the rel attribute set to noreferrer noopener to prevent possible malicious attacks from the pages you link to
      });
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.log("error", error);
    }
  }
  async #getExpiredTime(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

    return date;
  }
  async register(payload) {
    let err = null;
    let { username, email, password, confirmPassword, role } = payload.body;
    if (!username || !email || !password || !confirmPassword) {
      err = "Data can't be empty!";
      return [err, null];
    }
    let conditions = { username };
    let [error, isUserFound] = await userRepository.viewOneUser(conditions);
    if (isUserFound) {
      error = "Username is already exist.";
      return [error, null];
    }
    conditions = { email };
    [error, isUserFound] = await userRepository.viewOneUser(conditions);
    if (isUserFound) {
      error = "Email is already exist.";
      return [error, null];
    }
    const isEmail = await validator.isEmail(email);
    if (!isEmail) {
      err = "Please enter your email";
      return [err, null];
    } else if (password !== confirmPassword) {
      err = "Password does not match";
      return [err, null];
    } else {
      let isStrongPassword = await validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
      });
      if (!isStrongPassword) {
        err =
          "Password is weak: must contain minimum 1 letter, 1 number, 1 symbol, 1 lowercase, 1 uppercase and lenght more than 8 characters";
        return [err, null];
      } else {
        password = await this.#encrypt(password, 3);
        const verifiedToken = uuidv4();
        const expiredTokenAt = await this.#getExpiredTime(1);
        const conditions = {
          username,
          email,
          password,
          role,
          verifiedToken,
          expiredTokenAt,
        };
        const verifyUser = {
          username,
          email,
          verifiedToken,
        };
        this.#sendEmail(verifyUser);
        return await userRepository.createUser(conditions);
      }
    }
  }
  async login(payload) {
    let err = null;
    const { username, password } = payload.body;
    if (!username || !password) {
      err = "Password/Username does not empty";
      return [err, null];
    }
    const conditions = {
      username: username,
    };
    let [error, isUserFound] = await userRepository.viewOneUser(conditions);
    if (error) {
      error = "User is not found";
      return [error, null];
    } else if (isUserFound) {
      const dbPassword = isUserFound.password;
      const isTruePassword = await this.#checkPassword(password, dbPassword);
      if (!isTruePassword) {
        err = "Password does not match";
        return [err, null];
      } else {
        try {
          const secretKey = await this.#secretKey();
          let token = jwt.sign(
            {
              userId: isUserFound.id,
              username: isUserFound.username,
              role: isUserFound.role,
            },
            secretKey,
            { expiresIn: 60 * 60 }
          );
          return [err, token];
        } catch (error) {
          console.log(error);
          return [error, null];
        }
      }
    }
  }
  async verifiedUser(payload) {
    const token = payload.params.token;
    const conditions = { verifiedToken: token };
    let [error, validatedToken] = await userRepository.viewOneUser(conditions);
    if (
      error ||
      validatedToken.verifiedToken !== token ||
      validatedToken.expiredTokenAt <= new Date()
    ) {
      error = "Your verify process is invalid";
      return [error, null];
    } else {
      const verifiedAt = new Date();
      const conditions = { _id: validatedToken.id };
      const update = { verifiedAt };
      return await userRepository.editUser(conditions, update);
    }
  }
  async resendEmailVerified(payload) {
    const { userId } = payload.user;
    const conditions = {
      _id: userId,
    };
    let [error, isUserFound] = await userRepository.viewOneUser(conditions);
    if (error) {
      error = "User is not found";
      return [error, null];
    } else {
      const verifiedToken = uuidv4();
      const expiredTokenAt = await this.#getExpiredTime(1);
      const conditions = { _id: isUserFound.id };
      const update = { verifiedToken, expiredTokenAt };
      const verifyUser = {
        username: isUserFound.username,
        email: isUserFound.email,
        verifiedToken,
      };
      this.#sendEmail(verifyUser);
      return await userRepository.editUser(conditions, update);
    }
  }
}

module.exports = AuthService;
