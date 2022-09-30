namespace Essence;

[Route("api/[controller]")]
[ApiController]
public class UsersTracksController : Controller {
    private readonly EssenceContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<UsersTracksController> _logger;
    private readonly JwtService _jwtService;

    public UsersTracksController(
        EssenceContext context, IMapper mapper, 
        ILogger<UsersTracksController> logger, JwtService jwtService
    ) {
        _context = context;
        _mapper = mapper;
        _logger = logger;
        _jwtService = jwtService;
    }

    // POST: api/UsersTracks
    [HttpPost]
    public async Task<ActionResult<UsersTrackCreateDto>> PostUsersTrack([FromBody] UsersTrackCreateDto usersTrackDto) {
        try {
            var usersTrack = _mapper.Map<UsersTrack>(usersTrackDto);

            // Check if user exists
            bool userExists = await _context.Users.FirstOrDefaultAsync(x => x.UserId == usersTrack.UserId) != null;
            if (!userExists) return NotFound($"User (ID: {usersTrack.UserId}) does not exist");

            // Check if track exists
            bool trackExists = await _context.Tracks.FirstOrDefaultAsync(x => x.TrackId == usersTrack.TrackId) != null;
            if (!trackExists) return NotFound($"Track (ID: {usersTrack.TrackId}) does not exist");

            // Add track to user's library
            await _context.UsersTracks.AddAsync(usersTrack);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Added: Track (ID: {usersTrack.TrackId}) to UsersTracks");
            return Ok($"Added: Track (ID: {usersTrack.TrackId}) to UsersTracks");
        } catch (Exception ex) {
            _logger.LogError($"PostUsersTrack(usersTrackDto) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/UsersTracks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsersTracksReadDto>>> GetUsersTracks() {
        try {
            // Check if user is logged in
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return Ok("No user is logged in");

            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            // Get tracks from user's library
            var usersTracks = await _context.UsersTracks
                .ProjectTo<UsersTracksReadDto>(_mapper.ConfigurationProvider)
                .Select(x => x)
                .Where(x => x.UserId == userId)
                .ToListAsync();

            return Ok(usersTracks);
        } catch (Exception ex) {
            _logger.LogError($"GetUsersTracks() threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/UsersTracks/7
    [HttpGet("{id}")]
    public async Task<ActionResult<UsersTracksReadDto>> GetUsersTrack([Required] int id) {
        try {
            // Check if user is logged in
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return Ok("No user is logged in");

            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            // Get track from user's library
            var usersTrack = await _context.UsersTracks
                .ProjectTo<UsersTracksReadDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id);

            return Ok(usersTrack);
        } catch (Exception ex) {
            _logger.LogError($"GetUsersTrack(id) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // DELETE: api/UsersTracks/7
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUsersTrack([Required] int id) {
        try {
            // Check if user is logged in
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return Ok("No user is logged in");

            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            // Delete track from user's library
            var usersTrack = await _context.UsersTracks
                .FirstOrDefaultAsync(x => x.UserId == userId && x.TrackId == id);

            if (usersTrack == null) return NotFound($"Track (ID: {id}) in UsersTracks does not exist");

            _context.UsersTracks.Remove(usersTrack);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Deleted: Track (ID: {usersTrack.TrackId}) from UsersTracks");
            return Ok($"Deleted: Track (ID: {usersTrack.TrackId}) from UsersTracks");
        } catch (Exception ex) {
            _logger.LogError($"DeleteUsersTrack(id) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}
