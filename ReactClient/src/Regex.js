const Regex = {
    Email: /\S+@\S+\.\S+/,
    Username: /^[A-z][A-z0-9-_]{3,22}$/,
    Password: /^(?=.{8,24}$)(?!.*[_.]{2})[a-zA-Z0-9!@#$%]+(?<![_.])$/,
    PlaylistName: /^.{4,32}$/,
    PlaylistDescription: /^.{0,100}$/
};

export default Regex;