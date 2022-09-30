namespace Essence;

[Route("api/[controller]")]
[ApiController]
public class PlaylistsTracksController : Controller {
    private readonly EssenceContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<PlaylistsTracksController> _logger;
    private readonly JwtService _jwtService;

    public PlaylistsTracksController(
        EssenceContext context, IMapper mapper, 
        ILogger<PlaylistsTracksController> logger, JwtService jwtService
    ) {
        _context = context;
        _mapper = mapper;
        _logger = logger;
        _jwtService = jwtService;
    }

    // POST: api/PlaylistsTracks
    [HttpPost]
    public async Task<ActionResult<PlaylistsTrackCreateDto>> PostPlaylistsTrack([FromBody] PlaylistsTrackCreateDto playlistsTrackDto) {
        try {
            var playlistsTrack = _mapper.Map<PlaylistsTrack>(playlistsTrackDto);

            // Check if playlist exists
            bool playlistExists = await _context.Playlists.FirstOrDefaultAsync(x => x.PlaylistId == playlistsTrack.PlaylistId) != null;
            if (!playlistExists) return NotFound($"Playlist (ID: {playlistsTrack.PlaylistId}) does not exist");

            // Check if track exists
            bool trackExists = await _context.Tracks.FirstOrDefaultAsync(x => x.TrackId == playlistsTrack.TrackId) != null;
            if (!trackExists) return NotFound($"Track (ID: {playlistsTrack.TrackId}) does not exist");

            // Check if track is already added
            bool sameTrack = await _context.PlaylistsTracks.FirstOrDefaultAsync(
                x => x.PlaylistId == playlistsTrack.PlaylistId && 
                x.TrackId == playlistsTrack.TrackId
            ) != null;
            if (sameTrack) return Conflict($"Track (ID: {playlistsTrack.TrackId}) already exists in the playlist");

            // Add track to playlist
            await _context.PlaylistsTracks.AddAsync(playlistsTrack);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Added: Track (ID: {playlistsTrack.TrackId}) to Playlist (ID: {playlistsTrack.PlaylistId})");
            return Ok($"Added: Track (ID: {playlistsTrack.TrackId}) to Playlist (ID: {playlistsTrack.PlaylistId})");
        } catch (Exception ex) {
            _logger.LogError($"PostPlaylistsTrack(playlistsTrackDto) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/PlaylistsTracks/7
    [HttpGet("{playlistId}")]
    public async Task<ActionResult<IEnumerable<PlaylistsTracksReadDto>>> GetPlaylistsTracks([Required] int playlistId) {
        try {
            var playlistsTracks = await _context.PlaylistsTracks
                .ProjectTo<PlaylistsTracksReadDto>(_mapper.ConfigurationProvider)
                .Select(x => x)
                .Where(x => x.PlaylistId == playlistId)
                .ToListAsync();

            /* If playlist is private - check if it is owned by user. 
             * If not - playlist's tracks should not be visibile */
            var playlist = await _context.Playlists.FirstOrDefaultAsync(x => x.PlaylistId == playlistId);
            if (playlist == null) return NotFound($"Playlist (ID: {playlistId} does not exist");

            if (!playlist.Public) {
                var jwt = Request.Cookies["jwt"];
                if (jwt == null) return Ok("No user is logged in");

                
                var token = _jwtService.Verify(jwt);
                int userId = int.Parse(token.Issuer);

                if (playlist.UserId != userId) return Unauthorized($"Playlist (ID: {playlist.PlaylistId}) is not accesible.");
            }

            return Ok(playlistsTracks);
        } catch (Exception ex) {
            _logger.LogError($"GetPlaylistsTracks(playlistId) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/PlaylistsTracks?id=7&playlistId=7
    [HttpGet]
    public async Task<ActionResult<PlaylistsTracksReadDto>> GetPlaylistsTrack([Required] int id, [Required] int playlistId) {
        try {
            var playlistsTrack = await _context.PlaylistsTracks
                .ProjectTo<PlaylistsTracksReadDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id && x.PlaylistId == playlistId);

            return Ok(playlistsTrack);
        } catch (Exception ex) {
            _logger.LogError($"GetPlaylistsTrack(id, playlistId) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // DELETE: api/PlaylistsTracks/7?playlistId=7
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlaylistsTrack([Required] int id, [Required] int playlistId) {
        try {
            /* Check if user owns playlist. 
             * If he does - delete */
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return Ok("No user is logged in");

            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            // Delete playlist
            var playlistsTrack = await _context.PlaylistsTracks
                .FirstOrDefaultAsync(x => x.TrackId == id && x.PlaylistId == playlistId);

            if (playlistsTrack == null) return BadRequest($"PlaylistsTrack (ID: {id}) does not exist");

            _context.PlaylistsTracks.Remove(playlistsTrack);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Deleted: Track (ID: {id}) from PlaylistsTracks");
            return Ok($"Deleted: Track (ID: {id}) from PlaylistsTracks");
        } catch (Exception ex) {
            _logger.LogError($"DeletePlaylistsTrack(id, playlistId) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}
