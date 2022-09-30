using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Essence
{
    public partial class EssenceContext : DbContext
    {
        public EssenceContext()
        {
        }

        public EssenceContext(DbContextOptions<EssenceContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Album> Albums { get; set; } = null!;
        public virtual DbSet<Artist> Artists { get; set; } = null!;
        public virtual DbSet<Genre> Genres { get; set; } = null!;
        public virtual DbSet<Playlist> Playlists { get; set; } = null!;
        public virtual DbSet<PlaylistsTrack> PlaylistsTracks { get; set; } = null!;
        public virtual DbSet<TablesRow> TablesRows { get; set; } = null!;
        public virtual DbSet<Track> Tracks { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<UsersAlbum> UsersAlbums { get; set; } = null!;
        public virtual DbSet<UsersPlaylist> UsersPlaylists { get; set; } = null!;
        public virtual DbSet<UsersTrack> UsersTracks { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured) {
                optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=Essence;Trusted_Connection=True;MultipleActiveResultSets=true");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Album>(entity =>
            {
                entity.HasIndex(e => e.ArtistId, "IFK_AlbumArtistId");

                entity.Property(e => e.AlbumId).ValueGeneratedNever();

                entity.Property(e => e.Title).HasMaxLength(160);

                entity.HasOne(d => d.Artist)
                    .WithMany(p => p.Albums)
                    .HasForeignKey(d => d.ArtistId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AlbumsArtistId");

                entity.HasOne(d => d.Genre)
                    .WithMany(p => p.Albums)
                    .HasForeignKey(d => d.GenreId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AlbumsGenreId");
            });

            modelBuilder.Entity<Artist>(entity =>
            {
                entity.Property(e => e.ArtistId).ValueGeneratedNever();

                entity.Property(e => e.Name).HasMaxLength(120);
            });

            modelBuilder.Entity<Genre>(entity =>
            {
                entity.Property(e => e.GenreId).ValueGeneratedNever();

                entity.Property(e => e.Name).HasMaxLength(120);
            });

            modelBuilder.Entity<Playlist>(entity =>
            {
                entity.Property(e => e.PlaylistId).ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .HasMaxLength(100)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Name)
                    .HasMaxLength(32)
                    .HasDefaultValueSql("('Playlist')");

                entity.Property(e => e.Public)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Playlists)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PlaylistsUserId");
            });

            modelBuilder.Entity<PlaylistsTrack>(entity =>
            {
                entity.HasKey(e => new { e.PlaylistId, e.TrackId });

                entity.HasIndex(e => e.TrackId, "IFK_PlaylistTrackTrackId");

                entity.HasOne(d => d.Track)
                    .WithMany(p => p.PlaylistsTracks)
                    .HasForeignKey(d => d.TrackId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PlaylistsTracksTrackId");
            });

            modelBuilder.Entity<TablesRow>(entity =>
            {
                entity.HasKey(e => e.TableName);

                entity.Property(e => e.TableName)
                    .HasMaxLength(30)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Track>(entity =>
            {
                entity.HasIndex(e => e.AlbumId, "IFK_TrackAlbumId");

                entity.HasIndex(e => e.GenreId, "IFK_TrackGenreId");

                entity.Property(e => e.TrackId).ValueGeneratedNever();

                entity.Property(e => e.Name).HasMaxLength(200);

                entity.HasOne(d => d.Album)
                    .WithMany(p => p.Tracks)
                    .HasForeignKey(d => d.AlbumId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TracksAlbumId");

                entity.HasOne(d => d.Genre)
                    .WithMany(p => p.Tracks)
                    .HasForeignKey(d => d.GenreId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TracksGenreId");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email, "PK_Email")
                    .IsUnique();

                entity.HasIndex(e => e.Username, "PK_Username")
                    .IsUnique();

                entity.Property(e => e.UserId).ValueGeneratedNever();

                entity.Property(e => e.BirthDate).HasColumnType("date");

                entity.Property(e => e.Email).HasMaxLength(254);

                entity.Property(e => e.Password).HasMaxLength(254);

                entity.Property(e => e.Sex)
                    .HasMaxLength(6)
                    .HasDefaultValueSql("('Male')");

                entity.Property(e => e.Username).HasMaxLength(24);
            });

            modelBuilder.Entity<UsersAlbum>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.AlbumId });

                entity.HasOne(d => d.Album)
                    .WithMany(p => p.UsersAlbums)
                    .HasForeignKey(d => d.AlbumId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UsersAlbumsAlbumId");
            });

            modelBuilder.Entity<UsersPlaylist>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.PlaylistId })
                    .HasName("PK_UserPlaylists");

                entity.HasOne(d => d.Playlist)
                    .WithMany(p => p.UsersPlaylists)
                    .HasForeignKey(d => d.PlaylistId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UsersPlaylistsPlaylistId");
            });

            modelBuilder.Entity<UsersTrack>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.TrackId });

                entity.HasOne(d => d.Track)
                    .WithMany(p => p.UsersTracks)
                    .HasForeignKey(d => d.TrackId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UsersTracksTrackId");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
