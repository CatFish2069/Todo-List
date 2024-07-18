const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const todoModel = require("./models/Todo");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000; // Default to port 5000 if PORT is not specified in .env
const MONGO_URL = process.env.MONGO_URL;

// Database Connection
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to Database'))
.catch((error) => console.log('Error Connecting to Database: ', error));

app.get('/', (req, res) => {
    res.send("Server is Running");
});

// Create Todo
app.post('/create', async (req, res) => {
    // Grab Data from Frontend
    const { title, description } = req.body;

    // Creating a new Object
    const todo = new todoModel({
        title: title,
        description: description,
    });

    // Save data to DB
    try {
        await todo.save();
        res.status(201).send("Todo Created Successfully");
    } catch (error) {
        console.log("Error creating todo: ", error);
        res.status(500).send("Failed to create todo");
    }
});

// Get Todo
app.get("/get", async (req, res) => {
    try {
        const todos = await todoModel.find({});
        res.status(200).json(todos);
    } catch (error) {
        console.log("Error fetching todos: ", error);
        res.status(500).send("Failed to fetch todos");
    }
});

// Delete Todo
app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await todoModel.findByIdAndDelete(id);
        res.status(200).send('Todo Deleted');
    } catch (error) {
        console.log("Error deleting todo: ", error);
        res.status(500).send("Failed to delete todo");
    }
});

// Update Todo
app.put('/update/:id', async (req, res) => {
    const { newTitle, newDescription } = req.body;
    const id = req.params.id;

    try {
        const todo = await todoModel.findByIdAndUpdate(id, {
            title: newTitle,
            description: newDescription
        }, { new: true });

        if (!todo) {
            return res.status(404).send('Todo Not found');
        }

        res.status(200).send(todo);
    } catch (error) {
        console.log("Error updating todo: ", error);
        res.status(500).send('Internal server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});
