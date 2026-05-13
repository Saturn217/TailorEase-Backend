
const sendEmail = async ({ to, subject, html }) => {
    
  console.log(`Email to: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body: ${html}`)
}

module.exports = sendEmail