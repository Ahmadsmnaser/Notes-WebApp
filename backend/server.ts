import { connectToDB } from './config/db';
import app from './expressApp'; // Import the express app

const PORT = process.env.PORT || 3001;
connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running at http://localhost:${PORT}`);
    });
});

