namespace Essence;

[Route("api/[controller]")]
[ApiController]
public class UsersPlaylistsController : Controller {
    private readonly EssenceContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<UsersPlaylistsController> _logger;
    private readonly JwtService _jwtService;

    public UsersPlaylistsController(
        EssenceContext context, IMapper mapper, 
        ILogger<UsersPlaylistsController> logger, JwtService jwtService
    ) {
        _context = context;
        _mapper = mapper;
        _logger = logger;
        _jwtService = jwtService;
    }

    // POST: api/UsersPlaylists
    [HttpPost]
    public async Task<ActionResult<UsersPlaylistCreateDto>> PostUsersPlaylist([FromBody] UsersPlaylistCreateDto usersPlaylistDto) {
        try {
            var usersPlaylist = _mapper.Map<UsersPlaylist>(usersPlaylistDto);

            // Check if user exists
            bool userExists = await _context.Users.FirstOrDefaultAsync(x => x.UserId == usersPlaylist.UserId) != null;
            if (!userExists) return NotFound($"User (ID: {usersPlaylist.UserId}) does not exist");

            // Check if playlist exists
            bool playlistExists = await _context.Playlists.FirstOrDefaultAsync(x => x.PlaylistId == usersPlaylist.PlaylistId) != null;
            if (!playlistExists) return NotFound($"Playlist (ID: {usersPlaylist.PlaylistId}) does not exist");

            // Adding playlist to user's library
            await _context.UsersPlaylists.AddAsync(usersPlaylist);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Added: Playlist (ID: {usersPlaylist.PlaylistId}) to UsersPlaylists");
            return Ok($"Added: Playlist (ID: {usersPlaylist.PlaylistId}) to UsersPlaylists");
        } catch (Exception ex) {
            _logger.LogError($"PostUsersPlaylist(usersPlaylistDto) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/UsersPlaylists?isOwner=false
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsersPlaylistsReadDto>>> GetUsersPlaylists(bool isOwner = false) {
        try {
            // Check if user is logged in
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return Ok("No user is logged in");

            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            // Get playlists from user's library
            var usersPlaylists = await _context.UsersPlaylists
                .ProjectTo<UsersPlaylistsReadDto>(_mapper.ConfigurationProvider)
                .Where(x => x.UserId == userId && (!isOwner || x.OwnerId == userId))
                .ToListAsync();

            return Ok(usersPlaylists);
        } catch (Exception ex) {
            _logger.LogError($"GetUsersPlaylists(owner) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/UsersPlaylists/7
    [HttpGet("{id}")]
    public async Task<ActionResult<UsersPlaylistsReadDto>> GetUsersPlaylist([Required] int id) {
        try {
            // Check if user is logged in
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return Ok("No user is logged in");

            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            // Get playlist from user's library
            var usersPlaylist = await _context.UsersPlaylists
                .ProjectTo<UsersPlaylistsReadDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.OwnerId == userId && x.Id == id);

            return Ok(usersPlaylist);
        } catch (Exception ex) {
            _logger.LogError($"GetUsersPlaylist(id) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // DELETE: api/UsersPlaylists/7
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUsersPlaylist([Required] int id) {
        try {
            // Check if user is logged in
            System.Diagnostics.Debug.WriteLine('a');
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return Ok("No user is logged in");
            System.Diagnostics.Debug.WriteLine('a');

            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);
            System.Diagnostics.Debug.WriteLine('a');

            // Delete playlist from user's library
            var usersPlaylist = await _context.UsersPlaylists
                .FirstOrDefaultAsync(x => x.UserId == userId && x.PlaylistId == id);
            System.Diagnostics.Debug.WriteLine('a');

            if (usersPlaylist == null) return NotFound($"Playlist (ID: {id}) in UsersPlaylists does not exist");
            System.Diagnostics.Debug.WriteLine('a');

            bool userIsOwner = await _context.Playlists.FirstOrDefaultAsync(
                x => x.UserId == userId && x.PlaylistId == id
            ) != null;
            if (userIsOwner) return BadRequest($"Can not delete because User (ID: {userId}) owns Playlist (ID: {id})");
            System.Diagnostics.Debug.WriteLine('a');

            _context.UsersPlaylists.Remove(usersPlaylist);
            await _context.SaveChangesAsync();
            System.Diagnostics.Debug.WriteLine('a');

            _logger.LogInformation($"Deleted: Playlist (ID: {usersPlaylist.PlaylistId}) from UsersPlaylists");
            return Ok($"Deleted: Playlist (ID: {usersPlaylist.PlaylistId}) from UsersPlaylists");
        } catch (Exception ex) {
            _logger.LogError($"DeleteUsersPlaylist(id) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}
