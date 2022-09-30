namespace Essence; 

public class MapperConfiguration : Profile {
    public MapperConfiguration() {
        // Albums - READ
        CreateMap<Album, AlbumsSearchReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.AlbumId))
            .ForMember(x => x.Name, y => y.MapFrom(x => x.Title))
            .ForMember(x => x.Artist, y => y.MapFrom(x => x.Artist.Name))
            .ReverseMap();

        CreateMap<Album, AlbumsReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.AlbumId))
            .ForMember(x => x.ArtistId, y => y.MapFrom(x => x.Artist.ArtistId))
            .ForMember(x => x.Artist, y => y.MapFrom(x => x.Artist.Name))
            .ForMember(x => x.Genre, y => y.MapFrom(x => x.Genre.Name))
            .ReverseMap();

        CreateMap<Album, AlbumReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.AlbumId))
            .ForMember(x => x.Artist, y => y.MapFrom(x => x.Artist.Name))
            .ForMember(x => x.Genre, y => y.MapFrom(x => x.Genre.Name))
            .ForMember(x => x.Duration, y => y.MapFrom(
                x => Utilities.ConvertSecondsToTime(x.Tracks.Sum(x => x.Seconds))
            ))
            .ForMember(x => x.Ids, y => y.MapFrom(x => x.Tracks.Select(x => x.TrackId)))
            .ForMember(x => x.Titles, y => y.MapFrom(x => x.Tracks.Select(x => x.Name)))
            .ForMember(x => x.Durations, y => y.MapFrom(x => 
                x.Tracks.Select(x => Utilities.ConvertSecondsToTime(x.Seconds))
            ))
            .ReverseMap();

        // Artists - READ
        CreateMap<Artist, ArtistsSearchReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.ArtistId))
            .ReverseMap();

        CreateMap<Artist, ArtistReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.ArtistId))
            .ForMember(x => x.Genres, y => y.MapFrom(x => 
                string.Join(", ", x.Albums
                    .GroupBy(x => x.Genre.Name)
                    .Select(x => x.Key).ToList()
                )
            ))
            .ForMember(x => x.Ids, y => y.MapFrom(x => x.Albums.Select(x => x.AlbumId)))
            .ForMember(x => x.Titles, y => y.MapFrom(x => x.Albums.Select(x => x.Title)))
            .ForMember(x => x.Durations, y => y.MapFrom(x =>
                x.Albums.Select(
                    x => Utilities.ConvertSecondsToTime(x.Tracks.Select(x => x.Seconds).Sum())
                )
            ))
            .ReverseMap();

        // Genres - READ
        CreateMap<Genre, GenreReadDto>().ReverseMap();

        // Tracks - READ
        CreateMap<Track, TracksSearchReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.TrackId))
            .ForMember(x => x.Artist, y => y.MapFrom(x => x.Album.Artist.Name))
            .ReverseMap();

        CreateMap<Track, TracksReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.TrackId))
            .ForMember(x => x.ArtistId, y => y.MapFrom(x => x.Album.Artist.ArtistId))
            .ForMember(x => x.Title, y => y.MapFrom(x => x.Name))
            .ForMember(x => x.Artist, y => y.MapFrom(x => x.Album.Artist.Name))
            .ForMember(x => x.Genre, y => y.MapFrom(x => x.Genre.Name))
            .ForMember(x => x.Duration, y => y.MapFrom(x => Utilities.ConvertSecondsToTime(x.Seconds)))
            .ReverseMap();

        // Playlists - Create
        CreateMap<PlaylistCreateDto, Playlist>()
            .ForMember(x => x.UserId, y => y.MapFrom(x => x.OwnerId))
            .ForMember(x => x.Name, y => y.MapFrom(x => x.Title))
            .ForMember(x => x.Public, y => y.MapFrom(x => x.Visibility == "Public"))
            .ReverseMap();

        // Playlists - READ
        CreateMap<Playlist, PlaylistsSearchReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.PlaylistId))
            .ForMember(x => x.Owner, y => y.MapFrom(x => x.User.Username))
            .ReverseMap();

        CreateMap<Playlist, PlaylistsReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.PlaylistId))
            .ForMember(x => x.OwnerId, y => y.MapFrom(x => x.User.UserId))
            .ForMember(x => x.Owner, y => y.MapFrom(x => x.User.Username))
            .ForMember(x => x.Title, y => y.MapFrom(x => x.Name))
            .ForMember(x => x.Visibility, y => y.MapFrom(x => x.Public ? "Public" : "Private"))
            .ReverseMap();

        CreateMap<Playlist, PlaylistReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.PlaylistId))
            .ForMember(x => x.OwnerId, y => y.MapFrom(x => x.User.UserId))
            .ForMember(x => x.Owner, y => y.MapFrom(x => x.User.Username))
            .ForMember(x => x.Title, y => y.MapFrom(x => x.Name))
            .ForMember(x => x.Visibility, y => y.MapFrom(x => x.Public ? "Public" : "Private"))
            .ForMember(x => x.Likes, y => y.MapFrom(
                x => x.UsersPlaylists.Count(y => x.PlaylistId == y.PlaylistId)
            ))
            .ReverseMap();

        // Playlists - UPDATE
        CreateMap<PlaylistUpdateDto, Playlist>()
            .ForMember(x => x.Name, y => y.MapFrom(x => x.Title))
            .ForMember(x => x.Public, y => y.MapFrom(x => x.Visibility == "Public"))
            .ReverseMap();

        // PlaylistsTracks - CREATE
        CreateMap<PlaylistsTrackCreateDto, PlaylistsTrack>()
            .ForMember(x => x.TrackId, y => y.MapFrom(x => x.Id))
            .ReverseMap();

        // PlaylistsTracks - READ
        CreateMap<PlaylistsTrack, PlaylistsTracksReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.TrackId))
            .ForMember(x => x.ArtistId, y => y.MapFrom(x => x.Track.Album.ArtistId))
            .ForMember(x => x.Title, y => y.MapFrom(x => x.Track.Name))
            .ForMember(x => x.Artist, y => y.MapFrom(x => x.Track.Album.Artist.Name))
            .ForMember(x => x.Duration, y => y.MapFrom(x => Utilities.ConvertSecondsToTime(x.Track.Seconds)))
            .ReverseMap();


        // Users - CREATE
        CreateMap<UserCreateDto, User>().ReverseMap();

        // Users - READ
        CreateMap<User, UserReadDto>()
            .ForMember(x => x.Age, y => y.MapFrom(x => Utilities.ConvertBirthDateToAge(x.BirthDate)))
            .ReverseMap();

        CreateMap<User, UserPrivateReadDto>()
            .ForMember(x => x.Age, y => y.MapFrom(x => Utilities.ConvertBirthDateToAge(x.BirthDate)))
            .ReverseMap();

        CreateMap<User, UserConfirmCreateDto>().ReverseMap();

        CreateMap<User, UserCheckCreateDto>().ReverseMap();

        // Users - UPDATE
        CreateMap<UserUpdateDto, User>().ReverseMap();

        // UsersAlbums - CREATE
        CreateMap<UsersAlbumCreateDto, UsersAlbum>()
            .ForMember(x => x.AlbumId, y => y.MapFrom(x => x.Id))
            .ReverseMap();

        // UsersAlbums - READ
        CreateMap<UsersAlbum, UsersAlbumsReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.AlbumId))
            .ForMember(x => x.ArtistId, y => y.MapFrom(x => x.Album.Artist.ArtistId))
            .ForMember(x => x.Title, y => y.MapFrom(x => x.Album.Title))
            .ForMember(x => x.Artist, y => y.MapFrom(x => x.Album.Artist.Name))
            .ForMember(x => x.Genre, y => y.MapFrom(x => x.Album.Genre.Name))
            .ReverseMap();

        // UsersTracks - CREATE
        CreateMap<UsersTrackCreateDto, UsersTrack>()
            .ForMember(x => x.TrackId, y => y.MapFrom(x => x.Id))
            .ReverseMap();

        // UsersTracks - READ
        CreateMap<UsersTrack, UsersTracksReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.TrackId))
            .ForMember(x => x.ArtistId, y => y.MapFrom(x => x.Track.Album.Artist.ArtistId))
            .ForMember(x => x.Title, y => y.MapFrom(x => x.Track.Name))
            .ForMember(x => x.Artist, y => y.MapFrom(x => x.Track.Album.Artist.Name))
            .ForMember(x => x.Genre, y => y.MapFrom(x => x.Track.Genre.Name))
            .ReverseMap();

        // UsersPlaylists - CREATE
        CreateMap<UsersPlaylistCreateDto, UsersPlaylist>()
            .ForMember(x => x.PlaylistId, y => y.MapFrom(x => x.Id))
            .ReverseMap();

        // UsersPlaylists - READ
        CreateMap<UsersPlaylist, UsersPlaylistsReadDto>()
            .ForMember(x => x.Id, y => y.MapFrom(x => x.PlaylistId))
            .ForMember(x => x.OwnerId, y => y.MapFrom(x => x.Playlist.User.UserId))
            .ForMember(x => x.Owner, y => y.MapFrom(x => x.Playlist.User.Username))
            .ForMember(x => x.Title, y => y.MapFrom(x => x.Playlist.Name))
            .ForMember(x => x.Description, y => y.MapFrom(x => x.Playlist.Description))
            .ForMember(x => x.Visibility, y => y.MapFrom(x => x.Playlist.Public ? "Public" : "Private"))
            .ReverseMap();

        // TablesRows - READ
        CreateMap<TablesRow, TablesRowsReadDto>().ReverseMap();
    }
}