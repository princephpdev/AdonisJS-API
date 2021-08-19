import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "App/Models/Post";
import CreatePostValidator from "App/Validators/CreatePostValidator";
import UpdatePostValidator from "App/Validators/UpdatePostValidator";
export default class PostsController {
    public async index({ request }: HttpContextContract) {
        let page = request.input('page', 1)
        if (isNaN(page)) {
            page = 1
        }
        const limit = 10
        const posts = await Post.query().preload('user').paginate(page, limit);
        return posts.toJSON()
    }
    public async show({ params, response }: HttpContextContract) {
        try {
            let post_id = params.id
            if (isNaN(post_id)) {
                response.status(422)
                return {
                    "message": "Invalid data"
                }
            }
            const post = await Post.find(params.id);
            if (post) {
                await post.load('user');
                return post
            } else {
                response.status(401)
                return {
                    "message": "Post not found"
                }
            }
        } catch (error) {
            console.log(error)
        }

    }

    public async update({ request, response, params }: HttpContextContract) {
        await request.validate(UpdatePostValidator)
        let post_id = params.id
        if (isNaN(post_id)) {
            response.status(422)
            return {
                "message": "Invalid data"
            }
        }
        const post = await Post.find(params.id);
        if (post) {
            post.title = request.input('title');
            post.content = request.input('content');
            if (await post.save()) {
                await post.load('user')
                return post
            }
            response.status(500)
            return {
                "message": "Something went wrong"
            }
        }
        response.status(401)
        return {
            "message": "Post not found"
        }
    }

    public async store({ auth, request }: HttpContextContract) {
        await request.validate(CreatePostValidator)
        const user = await auth.authenticate();
        const post = new Post();
        post.title = request.input('title');
        post.content = request.input('content');
        try {
            await user.related('posts').save(post)
            return post
        } catch (error) {
            console.error()
            return {
                "message": "something went wrong"
            }
        }
    }

    public async destroy({ response, auth, params }: HttpContextContract) {
        let post_id = params.id
        if (isNaN(post_id)) {
            response.status(422)
            return {
                "message": "Invalid data"
            }
        }
        const user = await auth.authenticate();
        const post = await Post.find(params.id);
        if (post) {
            if (await Post.query().where('user_id', user.id).where('id', params.id).delete()) {
                return {
                    "message": "Post deleted successfully"
                }
            } else {
                return {
                    "message": "Sorry!! Post can not be deleted"
                }
            }
        } else {
            response.status(401)
            return {
                "message": "Post not found"
            }
        }
    }
}