using System;
using System.Collections.Generic;

namespace Essence
{
    public partial class Album
    {
        public Album()
        {
            Tracks = new HashSet<Track>();
            UsersAlbums = new HashSet<UsersAlbum>();
        }

        public int AlbumId { get; set; }
        public string Title { get; set; } = null!;
        public int ArtistId { get; set; }
        public int GenreId { get; set; }

        public virtual Artist Artist { get; set; } = null!;
        public virtual Genre Genre { get; set; } = null!;
        public virtual ICollection<Track> Tracks { get; set; }
        public virtual ICollection<UsersAlbum> UsersAlbums { get; set; }
    }
}
