import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	  email: schema.string({
		  escape:true,
		  trim:true
	  },[
		  rules.email(),
		  rules.exists({ table: 'users', column: 'email' , caseInsensitive: true}),
		  rules.minLength(3),
		  rules.maxLength(100)
	  ]),
	  password: schema.string({
		escape:true,
		trim:true
	  },[
		  rules.minLength(6),
		  rules.maxLength(100)
	  ])
  })

  public messages = {}
}
