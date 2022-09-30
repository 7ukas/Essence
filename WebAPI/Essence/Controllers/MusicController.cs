namespace Essence;

[Route("api/[controller]")]
[ApiController]
public class MusicController : Controller {
    private readonly EssenceContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<MusicController> _logger;

    public MusicController(EssenceContext context, IMapper mapper, ILogger<MusicController> logger) {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    private static int _maxRows = 8;

    // GET: api/Music/q=word
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MusicReadDto>>> GetMusic([Required] string q = "") {
        try {
            if (q.Length < 2) return BadRequest("Query must be atleast 2 characters long");

            var artists = await _context.Artists
                .ProjectTo<ArtistsSearchReadDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            var albums = await _context.Albums
                .ProjectTo<AlbumsSearchReadDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            var tracks = await _context.Tracks
                .ProjectTo<TracksSearchReadDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            var playlists = await _context.Playlists
                .ProjectTo<PlaylistsSearchReadDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            /* Find 8 closest matches to searched word (of each type) */
            MusicReadDto Music = new MusicReadDto();

            // Artists
            artists = artists
                .OrderBy(x => Utilities.LevenshteinDistance(q, x.Name))
                .ToList();
            Music.Artists = artists.GetRange(0, artists.Count < _maxRows ? artists.Count : _maxRows);

            // Albums
            albums = albums
                .OrderBy(x => Utilities.LevenshteinDistance(q, x.Name))
                .ToList();
            Music.Albums = albums.GetRange(0, albums.Count < _maxRows ? albums.Count : _maxRows);

            // Tracks
            tracks = tracks
                .OrderBy(x => Utilities.LevenshteinDistance(q, x.Name))
                .ToList();
            Music.Tracks = tracks.GetRange(0, tracks.Count < _maxRows ? tracks.Count : _maxRows);

            // Playlists
            playlists = playlists
                .OrderBy(x => Utilities.LevenshteinDistance(q, x.Name))
                .ToList();
            Music.Playlists = playlists.GetRange(0, playlists.Count < _maxRows ? playlists.Count : _maxRows);

            return Ok(Music);
        } catch (Exception ex) {
            _logger.LogError($"GetMusic(q) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}
