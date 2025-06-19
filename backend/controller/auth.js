export const logout = (req, res) => {
    res.clearCookie('accessToken'); 
    res.status(200).json({ message: 'Logged out' });
};