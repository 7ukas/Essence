using System;
using System.Collections.Generic;

namespace Essence
{
    public partial class Genre
    {
        public Genre()
        {
            Albums = new HashSet<Album>();
            Tracks = new HashSet<Track>();
        }

        public int GenreId { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<Album> Albums { get; set; }
        public virtual ICollection<Track> Tracks { get; set; }
    }
}
