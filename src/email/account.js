const sgMail = require("@sendgrid/mail")

const sendGridAPI = process.env.SENDGRID_API_KEY

//Set mo muna yung api key
sgMail.setApiKey(sendGridAPI)

//Sample pano magsend ng email
// sgMail.send({
//     to: "rjun170@gmail.com",
//     from: "rivera.anselmo.2001@gmail.com",
//     subject: "hello jun",
//     text: "TESTING SGMAIL API"
// })

const newUserWelcomingEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "rivera.anselmo.2001@gmail.com", // dapat dito is domain
        subject: "Thanks for joining in",
        text: `Welcome to the app ${name}, Let me know how you get along with the app`
    })
}


const emailCancelingAccount = (email, name) => {
    sgMail.send({
        to: email,
        from: "rivera.anselmo.2001@gmail.com", // dapat dito is domain
        subject: "Canceling the Account for Task App",
        text: `Hello ${name}, We just receive a information that you remove you're account
               in the Task App, Let me know how did this happen?`
    })
}


module.exports = {
    newUserWelcomingEmail,
    emailCancelingAccount
}