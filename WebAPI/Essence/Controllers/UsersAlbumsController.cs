namespace Essence;

[Route("api/[controller]")]
[ApiController]
public class UsersAlbumsController : Controller {
    private readonly EssenceContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<UsersAlbumsController> _logger;
    private readonly JwtService _jwtService;

    public UsersAlbumsController(
        EssenceContext context, IMapper mapper, 
        ILogger<UsersAlbumsController> logger, JwtService jwtService
    ) {
        _context = context;
        _mapper = mapper;
        _logger = logger;
        _jwtService = jwtService;
    }

    // POST: api/UsersAlbums
    [HttpPost]
    public async Task<ActionResult<UsersAlbumCreateDto>> PostUsersAlbum([FromBody] UsersAlbumCreateDto usersAlbumDto) {
        try {
            var usersAlbum = _mapper.Map<UsersAlbum>(usersAlbumDto);

            // Check if user exists
            bool userExists = await _context.Users.FirstOrDefaultAsync(x => x.UserId == usersAlbum.UserId) != null;

            System.Diagnostics.Debug.WriteLine($"{usersAlbumDto.Id} {usersAlbumDto.UserId}"); 
            if (!userExists) return NotFound($"User (ID: {usersAlbum.UserId}) does not exist");

            // Check if album exists
            bool albumExists = await _context.Albums.FirstOrDefaultAsync(x => x.AlbumId == usersAlbum.AlbumId) != null;
            if (!albumExists) return NotFound($"Album (ID: {usersAlbum.AlbumId}) does not exist");

            // Add album to user's library
            await _context.UsersAlbums.AddAsync(usersAlbum);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Added: Album (ID: {usersAlbum.AlbumId}) to UsersAlbums");
            return Ok($"Added: Album (ID: {usersAlbum.AlbumId}) to UsersAlbums");
        } catch (Exception ex) {
            _logger.LogError($"PostUsersAlbum(usersAlbumDto) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/UsersAlbums
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsersAlbumsReadDto>>> GetUsersAlbums() {
        try {
            // Check if user is logged in
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return Ok("No user is logged in");

            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            // Get albums from user's library
            var usersAlbums = await _context.UsersAlbums
                .ProjectTo<UsersAlbumsReadDto>(_mapper.ConfigurationProvider)
                .Select(x => x)
                .Where(x => x.UserId == userId)
                .ToListAsync();

            return Ok(usersAlbums);
        } catch (Exception ex) {
            _logger.LogError($"GetUsersAlbums() threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/UsersAlbums/7
    [HttpGet("{id}")]
    public async Task<ActionResult<UsersAlbumsReadDto>> GetUsersAlbum([Required] int id) {
        try {
            // Check if user is logged in
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return Ok("No user is logged in");

            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            // Get album from user's library
            var usersAlbum = await _context.UsersAlbums
                .ProjectTo<UsersAlbumsReadDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id);

            return Ok(usersAlbum);
        } catch (Exception ex) {
            _logger.LogError($"GetUsersAlbum(id) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // DELETE: api/UsersAlbums/7
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUsersAlbum([Required] int id) {
        try {
            // Check if user is logged in
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return Ok("No user is logged in");

            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            // Delete album from user's library
            var usersAlbum = await _context.UsersAlbums
                .FirstOrDefaultAsync(x => x.UserId == userId && x.AlbumId == id);

            if (usersAlbum == null) return NotFound($"Album (ID: {id}) in UsersAlbums does not exist");

            _context.UsersAlbums.Remove(usersAlbum);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Deleted: Album (ID: {usersAlbum.AlbumId}) from UsersAlbums");
            return Ok($"Deleted: Album (ID: {usersAlbum.AlbumId}) from UsersAlbums");
        } catch (Exception ex) {
            _logger.LogError($"DeleteUsersAlbum(id) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}
