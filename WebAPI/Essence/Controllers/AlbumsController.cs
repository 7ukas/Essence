namespace Essence;

[Route("api/[controller]")]
[ApiController]
public class AlbumsController : Controller {
    private readonly EssenceContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<AlbumsController> _logger;

    public AlbumsController(EssenceContext context, IMapper mapper, ILogger<AlbumsController> logger) {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    // GET: api/Albums/page=1&rows=20&q=word&sort=titleAsc
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AlbumsReadDto>>> GetAlbums(
        [Required] int page = 1, [Required] int rows = 20,
        string? q = null, string? sort = null
    ) {
        try {
            var albums = await _context.Albums
                .ProjectTo<AlbumsReadDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            // Set page according to rows amount
            if (page < 1) page = 1;
            else if (page > (albums.Count - 1) / rows + 1) {
                page = (albums.Count - 1) / rows + 1;
            }

            // Search (query) albums by: title, artist, genre
            if (q != null) {
                albums = albums.Select(x => x)
                    .Where(x => $"{x.Title}^{x.Artist}^{x.Genre}"
                        .IndexOf(q, StringComparison.OrdinalIgnoreCase) >= 0)
                    .ToList();
            }

            // Sort by: title, artist, genre in ascending/descending order
            if (sort != null) {
                switch (sort.ToLower()) {
                    case "titleasc":
                        albums = albums.OrderBy(x => x.Title).ToList();
                        break;
                    case "titledesc":
                        albums = albums.OrderByDescending(x => x.Title).ToList();
                        break;
                    case "artistasc":
                        albums = albums.OrderBy(x => x.Artist).ToList();
                        break;
                    case "artistdesc":
                        albums = albums.OrderByDescending(x => x.Artist).ToList();
                        break;
                    case "genreasc":
                        albums = albums.OrderBy(x => x.Genre).ToList();
                        break;
                    case "genredesc":
                        albums = albums.OrderByDescending(x => x.Genre).ToList();
                        break;
                }
            }

            // Set range of albums to output
            int index = (page - 1) * rows;
            int count = (page * rows) <= albums.Count ? rows : albums.Count % rows;

            albums = albums.GetRange(index, count);

            return Ok(albums);
        } catch (Exception ex) {
            _logger.LogError($"GetAlbums(page, rows, q, sort) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/Albums/7
    [HttpGet("{id}")]
    public async Task<ActionResult<AlbumReadDto>> GetAlbum([Required] int id) {
        try {
            var album = await _context.Albums
                .ProjectTo<AlbumReadDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id);

            return Ok(album);
        } catch (Exception ex) {
            _logger.LogError($"GetAlbum(id) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}
