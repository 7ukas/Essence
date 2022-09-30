using System;
using System.Collections.Generic;

namespace Essence
{
    public partial class Track
    {
        public Track()
        {
            PlaylistsTracks = new HashSet<PlaylistsTrack>();
            UsersTracks = new HashSet<UsersTrack>();
        }

        public int TrackId { get; set; }
        public string Name { get; set; } = null!;
        public int AlbumId { get; set; }
        public int GenreId { get; set; }
        public int Seconds { get; set; }

        public virtual Album Album { get; set; } = null!;
        public virtual Genre Genre { get; set; } = null!;
        public virtual ICollection<PlaylistsTrack> PlaylistsTracks { get; set; }
        public virtual ICollection<UsersTrack> UsersTracks { get; set; }
    }
}
