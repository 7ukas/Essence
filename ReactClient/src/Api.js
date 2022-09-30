const ApiDevUrl = 'https://essenceservice.azurewebsites.net';

const ApiDev = {
    Users: `${ApiDevUrl}/api/Users`,
    Artists: `${ApiDevUrl}/api/Artists`,
    Albums: `${ApiDevUrl}/api/Albums`,
    Tracks: `${ApiDevUrl}/api/Tracks`,
    Playlists: `${ApiDevUrl}/api/Playlists`,
    Music: `${ApiDevUrl}/api/Music`,

    UsersAlbums: `${ApiDevUrl}/api/UsersAlbums`,
    UsersTracks: `${ApiDevUrl}/api/UsersTracks`,
    UsersPlaylists: `${ApiDevUrl}/api/UsersPlaylists`,
    PlaylistsTracks: `${ApiDevUrl}/api/PlaylistsTracks`,
    
    TablesRows: `${ApiDevUrl}/api/TablesRows`
};

const Api = ApiDev;

export default Api;
