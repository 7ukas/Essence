﻿namespace Essence;

public class UsersPlaylistsReadDto {
    public int UserId { get; set; }
    public int Id { get; set; }
    public int OwnerId { get; set; }
    public string? Owner { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Visibility { get; set; }
}
