namespace Essence;

[Route("api/[controller]")]
[ApiController]
public class PlaylistsController : Controller {
    private readonly EssenceContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<PlaylistsController> _logger;
    private readonly JwtService _jwtService;

    public PlaylistsController(
        EssenceContext context, IMapper mapper, 
        ILogger<PlaylistsController> logger, JwtService jwtService
    ) {
        _context = context;
        _mapper = mapper;
        _logger = logger;
        _jwtService = jwtService;
    }

    // POST: api/Playlists
    [HttpPost]
    public async Task<ActionResult<PlaylistCreateDto>> PostPlaylist([FromBody] PlaylistCreateDto playlistDto) {
        try {
            var playlist = _mapper.Map<Playlist>(playlistDto);

            // Check if playlist already exists
            var samePlaylist = await _context.Playlists.FirstOrDefaultAsync(x => x.Name.ToLower() == playlist.Name.ToLower());
            if (samePlaylist != null) return Conflict($"Playlist (ID: {samePlaylist.PlaylistId}) already exists");

            // Set playlist's ID
            playlist.PlaylistId = _context.Playlists.Count() > 0 ? _context.Playlists.Max(x => x.PlaylistId) + 1 : 1;

            // Add playlist
            await _context.Playlists.AddAsync(playlist);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Created: Playlist (ID: {playlist.PlaylistId})"); 
            return CreatedAtAction(nameof(GetPlaylist), new { id = playlist.PlaylistId }, playlist);
            return Ok($"Created: Playlist (ID: {playlist.PlaylistId})");
        } catch (Exception ex) {
            _logger.LogError($"PostPlaylist(playlistDto) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/Playlists/page=1&rows=20&q=word&sort=titleAsc
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PlaylistsReadDto>>> GetPlaylists(
       [Required] int page = 1, [Required] int rows = 20,
       string? q = null, string? sort = null
    ) {
        try {
            var playlists = await _context.Playlists
                .ProjectTo<PlaylistsReadDto>(_mapper.ConfigurationProvider)
                .Select(x => x)
                .Where(x => x.Visibility == "Public")
                .ToListAsync();

            // Set page according to rows amount
            if (page < 1) page = 1;
            else if (page > (playlists.Count - 1) / rows + 1) {
                page = (playlists.Count - 1) / rows + 1;
            }

            // Search (query) albums by: title, owner
            if (q != null) {
                playlists = playlists.Select(x => x)
                    .Where(x => $"{x.Title}^{x.Owner}"
                        .IndexOf(q, StringComparison.OrdinalIgnoreCase) >= 0)
                    .ToList();
            }

            // Sort by: title, owner in ascending/descending order
            if (sort != null) {
                switch (sort.ToLower()) {
                    case "titleasc":
                        playlists = playlists.OrderBy(x => x.Title).ToList();
                        break;
                    case "titledesc":
                        playlists = playlists.OrderByDescending(x => x.Title).ToList();
                        break;
                    case "ownerasc":
                        playlists = playlists.OrderBy(x => x.Owner).ToList();
                        break;
                    case "ownerdesc":
                        playlists = playlists.OrderByDescending(x => x.Owner).ToList();
                        break;
                }
            }

            // Set range of playlists to output
            int index = (page - 1) * rows;
            int count = (page * rows) <= playlists.Count ? rows : playlists.Count % rows;

            playlists = playlists.GetRange(index, count);

            return Ok(playlists);
        } catch (Exception ex) {
            _logger.LogError($"GetPlaylists(page, rows, q, sort) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/Playlists/7
    [HttpGet("{id}")]
    public async Task<ActionResult<PlaylistReadDto>> GetPlaylist([Required] int id) {
        try {
            /* Check if user owns playlist. 
             * If he does - output it no matter the visibility */
            var jwt = Request.Cookies["jwt"];
            int userId = 0;

            if (jwt != null) {
                var token = _jwtService.Verify(jwt);
                userId = int.Parse(token.Issuer);
            }

            var playlist = await _context.Playlists
                .ProjectTo<PlaylistReadDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id && (x.OwnerId == userId || x.Visibility == "Public"));

            return Ok(playlist);
        } catch (Exception ex) {
            _logger.LogError($"GetPlaylist(id) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // PUT: api/Playlists/7
    [HttpPut("{id}")]
    public async Task<IActionResult> PutPlaylist([Required] int id, [FromBody] PlaylistUpdateDto playlistDto) {
        try {
            /* Check if user owns playlist. 
             * If he does - update */
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return Ok("No user is logged in");

            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            // Update playlist
            var playlist = await _context.Playlists
                .FirstOrDefaultAsync(x => x.PlaylistId == id && x.UserId == userId);

            if (playlist == null) return BadRequest($"Playlist (ID: {id}) does not exist or is not accesible");

            _mapper.Map(playlistDto, playlist);

            _context.Entry(playlist).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Updated: Playlist (ID: {id})");
            return Ok($"Updated: Playlist (ID: {id})");
        } catch (Exception ex) {
            _logger.LogError($"PutPlaylist(id, playlistDto) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // DELETE: api/Playlists/7
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlaylist([Required] int id) {
        try {
            /* Check if user owns playlist. 
             * If he does - delete */
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return Ok("No user is logged in");

            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            // Delete playlist
            var playlist = await _context.Playlists
                .FirstOrDefaultAsync(x => x.PlaylistId == id && x.UserId == userId);

            if (playlist == null) return BadRequest($"Playlist (ID: {id}) does not exist or is not accesible");

            _context.Playlists.Remove(playlist);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Deleted: Playlist (ID: {id})");
            return Ok($"Deleted: Playlist (ID: {id})");
        } catch (Exception ex) {
            _logger.LogError($"DeletePlaylist(id) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}