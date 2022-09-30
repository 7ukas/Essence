using System;
using System.Collections.Generic;

namespace Essence
{
    public partial class UsersAlbum
    {
        public int UserId { get; set; }
        public int AlbumId { get; set; }

        public virtual Album Album { get; set; } = null!;
    }
}
