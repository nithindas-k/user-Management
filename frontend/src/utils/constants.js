export const API_ROUTES = {
    LOGIN: "/login",
    PROFILE_UPDATE: "/user/profile",
    ADMIN_LOGIN: "/admin/login",
    GET_ALL_USERS: '/admin/users',
    DELETE_USER: (userID) => `/admin/user/${userID}`,
    CREATE_USER: "/admin/user",
    UPDATE_USER: (userID) => `/admin/user/${userID}`,
    REGISTER: '/register',
    LOGOUT: '/logout'

}