using System;
using System.Collections.Generic;

namespace Essence
{
    public partial class Playlist
    {
        public Playlist()
        {
            UsersPlaylists = new HashSet<UsersPlaylist>();
        }

        public int PlaylistId { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public bool Public { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual ICollection<UsersPlaylist> UsersPlaylists { get; set; }
    }
}
