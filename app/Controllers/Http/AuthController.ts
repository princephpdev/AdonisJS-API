import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import LoginValidator from "App/Validators/LoginValidator";
import RegisterValidator from "App/Validators/RegisterValidator";

export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    await request.validate(LoginValidator)
    const email = request.input("email");
    const password = request.input("password");
    const token = await auth.use("api").attempt(email, password, {
      expiresIn: "10 days",
    });
    return token.toJSON();
  }
  public async register({ request, auth }: HttpContextContract) {
    await request.validate(RegisterValidator)
    const email = request.input("email");
    const password = request.input("password");
    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    await newUser.save();
    const token = await auth.use("api").login(newUser, {
      expiresIn: "10 days",
    });
    return token.toJSON();
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return {
      message: "user logged out successfully"
    }
  }
}