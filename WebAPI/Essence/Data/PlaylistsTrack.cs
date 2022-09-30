using System;
using System.Collections.Generic;

namespace Essence
{
    public partial class PlaylistsTrack
    {
        public int PlaylistId { get; set; }
        public int TrackId { get; set; }

        public virtual Track Track { get; set; } = null!;
    }
}
