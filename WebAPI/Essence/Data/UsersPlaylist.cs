using System;
using System.Collections.Generic;

namespace Essence
{
    public partial class UsersPlaylist
    {
        public int UserId { get; set; }
        public int PlaylistId { get; set; }

        public virtual Playlist Playlist { get; set; } = null!;
    }
}
