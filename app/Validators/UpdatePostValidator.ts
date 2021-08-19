import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdatePostValidator {
	constructor(protected ctx: HttpContextContract) {
	}

	public schema = schema.create({
		title: schema.string({
			escape: true,
			trim: true
		}, [
			rules.minLength(2),
			rules.maxLength(50),
			rules.alpha({
				allow: ['space', 'underscore', 'dash']
			})
		]),

		content: schema.string({
			escape: true,
			trim: true
		}, [
			rules.minLength(5),
			rules.maxLength(200)
		])
	})

	public messages = {}
}
