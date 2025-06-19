import User from '../Model/user.js';
export const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.status(200).json({ message: 'Logged out' });
};
export const verifyToken = async (req, res) => {
    try {
        const token = req.cookies.accessToken;


        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const avtarURL = user?.avatar ? imageURL + user.avatar : null;

        const userWithRole = {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            role: user.isAdmin ? 'admin' : 'user',
            createdAt: user.createdAt,
            avatar: avtarURL
        };

        return res.status(200).json({
            message: 'Success',
            user: userWithRole,
            token,
        });

    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};