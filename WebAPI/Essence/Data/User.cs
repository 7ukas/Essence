using System;
using System.Collections.Generic;

namespace Essence
{
    public partial class User
    {
        public User()
        {
            Playlists = new HashSet<Playlist>();
        }

        public int UserId { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Username { get; set; } = null!;
        public DateTime BirthDate { get; set; }
        public string Sex { get; set; } = null!;

        public virtual ICollection<Playlist> Playlists { get; set; }
    }
}
