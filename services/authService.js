const encrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

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
  async register(payload) {
    let err = null;
    let { username, email, password, confirmPassword, role } = payload.body;
    if (!username || !email || !password || !confirmPassword) {
      err = "Data can't be empty!";
      return [err, null];
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
        const conditions = {
          username,
          email,
          password,
          role,
        };
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
}

module.exports = AuthService;
