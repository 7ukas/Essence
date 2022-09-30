namespace Essence;

[Route("api/[controller]")]
[ApiController]
public class TracksController : Controller {
    private readonly EssenceContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<TracksController> _logger;

    public TracksController(EssenceContext context, IMapper mapper, ILogger<TracksController> logger) {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    // GET: api/Tracks/page=1&rows=20&search=word&sort=titleAsc
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TracksReadDto>>> GetTracks(
        [Required] int page = 1, [Required] int rows = 20,
        string? q = null, string? sort = null
    ) {
        try {
            var tracks = await _context.Tracks
                .ProjectTo<TracksReadDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            // Set page according to rows amount
            if (page < 1) page = 1;
            else if (page > (tracks.Count - 1) / rows + 1) {
                page = (tracks.Count - 1) / rows + 1;
            }

            // Search tracks by: title, artist, genre
            if (q != null) {
                tracks = tracks.Select(x => x)
                    .Where(x => $"{x.Title}^{x.Artist}^{x.Genre}"
                        .IndexOf(q, StringComparison.OrdinalIgnoreCase) >= 0)
                    .ToList();
            }

            // Sort by: title, artist, genre in ascending/descending order
            if (sort != null) {
                switch (sort.ToLower()) {
                    case "titleasc":
                        tracks = tracks.OrderBy(x => x.Title).ToList();
                        break;
                    case "titledesc":
                        tracks = tracks.OrderByDescending(x => x.Title).ToList();
                        break;
                    case "artistasc":
                        tracks = tracks.OrderBy(x => x.Artist).ToList();
                        break;
                    case "artistdesc":
                        tracks = tracks.OrderByDescending(x => x.Artist).ToList();
                        break;
                    case "genreasc":
                        tracks = tracks.OrderBy(x => x.Genre).ToList();
                        break;
                    case "genredesc":
                        tracks = tracks.OrderByDescending(x => x.Genre).ToList();
                        break;
                }
            }

            // Set range of tracks to output
            int index = (page - 1) * rows;
            int count = (page * rows) <= tracks.Count ? rows : tracks.Count % rows;

            tracks = tracks.GetRange(index, count);

            return Ok(tracks);
        } catch (Exception ex) {
            _logger.LogError($"GetTracks(page, rows, q, sort) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/Tracks/7
    [HttpGet("{id}")]
    public async Task<ActionResult<TracksReadDto>> GetTrack([Required] int id) {
        try {
            var track = await _context.Tracks
                .ProjectTo<TracksReadDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id);

            return Ok(track);
        } catch (Exception ex) {
            _logger.LogError($"GetTrack(id) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}
