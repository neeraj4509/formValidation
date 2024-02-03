require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sendEmail = require('./sendEmail'); 


const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(bodyParser.json());

const submissions = [];

app.post('/submit', async (req, res) => {
    const { name, dob, email, phone } = req.body;

    if (!phone.match(/^\d{10}$/)) {
        return res.status(400).send({ message: 'Invalid phone number. Phone number must be 10 digits.' });
    }

    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return res.status(400).send({ message: 'Invalid email format.' });
    }

    const duplicatePhone = submissions.some(submission => submission.phone === phone);
    if (duplicatePhone) {
        return res.status(400).send({ message: 'A submission with the same phone number already exists.' });
    }

    const duplicateEmail = submissions.some(submission => submission.email === email);
    if (duplicateEmail) {
        return res.status(400).send({ message: 'A submission with the same email already exists.' });
    }

    try {
        await sendEmail({
            recipientEmail: email,
            subject: 'Form Submission Confirmation',
            text: `Hello ${name},\n\nThank you for submitting the form. Your details have been received.`
        });

        submissions.push({ name, dob, email, phone });
        res.status(200).send({ message: 'Form submitted successfully!' });
    } catch (error) {
        console.error('Error during form submission:', error);
        res.status(500).send({ message: 'An error occurred during form submission.' });
    }
});

app.get('/submissions', (req, res) => {
    const userEmail = req.query.email; 

    const userSubmissions = submissions.filter(submission => submission.email === userEmail);

    res.status(200).json(userSubmissions);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
