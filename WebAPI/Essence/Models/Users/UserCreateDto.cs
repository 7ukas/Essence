namespace Essence;

public class UserCreateDto {
    [Required]
    [StringLength(254)]
    public string? Email { get; set; }

    [Required]
    [StringLength(254)]
    public string? Password { get; set; }

    [Required]
    [StringLength(24)]
    public string? Username { get; set; }

    [Required]
    public DateTime BirthDate { get; set; }

    [Required]
    [StringLength(6)]
    public string? Sex { get; set; }
}
