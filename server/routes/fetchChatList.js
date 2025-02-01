const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/JWTauth');

router.post('/', authenticateToken, async (req, res) => {
    const applydata = req.body;
    const { user } = applydata;
    const authuser = req.user;
    
    if (user.email !== authuser.email || user.username !== authuser.id) {
        return res.status(505).json({ message: 'token failure' });
    }
    
    const users = db.collection('users');

    try {
        const userarr = await users.find({}).toArray();
        const foundUser = userarr.find(x => x.email === user.email);
        
        // Send chat if present, otherwise send null
        res.json({ chat: foundUser?.chats || null });

    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;