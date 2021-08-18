import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UsersController {
  public async postsByUser({ auth }: HttpContextContract) {
    const user = await auth.authenticate();
    await user.preload("posts");
    const posts = user.posts;
    return posts;
  }
}