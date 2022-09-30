namespace Essence;

[Route("api/[controller]")]
[ApiController]
public class UsersController : Controller {
    private readonly EssenceContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<UsersController> _logger;
    private readonly JwtService _jwtService;

    public UsersController(
        EssenceContext context, IMapper mapper, 
        ILogger<UsersController> logger, JwtService jwtService) {
        _context = context;
        _mapper = mapper;
        _logger = logger;
        _jwtService = jwtService;
    }

    // POST: api/Users/register
    [HttpPost("register")]
    public async Task<ActionResult<UserCreateDto>> PostUser([FromBody] UserCreateDto userDto) {
        try {
            var user = _mapper.Map<User>(userDto);

            // Hash password
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            // Check if same user already exists
            var sameUser = await _context.Users.FirstOrDefaultAsync(
                x => x.Email == user.Email || x.Username == user.Username
            );
            if (sameUser != null) return Conflict("User already exists");

            // Set user's ID
            user.UserId = _context.Users.Count() > 0 ? _context.Users.Max(x => x.UserId) + 1 : 1;

            // Add user
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Registered: User (ID: {user.UserId})");
            return Ok($"Registered: User (ID: {user.UserId})");
        } catch (Exception ex) {
            _logger.LogError($"PostUser(userDto) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
    
    // POST: api/Users/login
    [HttpPost("login")]
    public async Task<ActionResult<UserConfirmCreateDto>> PostUserLogin([FromBody] UserConfirmCreateDto userDto) {
        try {
            var user = _mapper.Map<User>(userDto);

            // Verify email
            var sameUser = await _context.Users
                .ProjectTo<UserPrivateReadDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Email == user.Email);

            if (sameUser == null) return NotFound("Email/Password is incorrect");

            // Verify password
            bool passwordValid = BCrypt.Net.BCrypt.Verify(user.Password, sameUser.Password);
            if (!passwordValid) return NotFound("Email/Password is incorrect");

            // Generate "JWT" cookie
            var jwt = _jwtService.Generate(sameUser.UserId);

            Response.Cookies.Append("jwt", jwt, new CookieOptions {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = userDto.Remember ? 
                    DateTimeOffset.Now.AddDays(30) : 
                    DateTimeOffset.Now.AddHours(1)
            });

            _logger.LogInformation($"Logged in: User (ID: {sameUser.UserId})");
            return Ok($"Logged in: User (ID: {sameUser.UserId})");
        } catch (Exception ex) {
            _logger.LogError($"PostUserLogin(userDto) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // POST: api/Users/check
    [HttpPost("check")]
    public async Task<ActionResult<UserCheckCreateDto>> PostUserCheck([FromBody] UserCheckCreateDto userDto) {
        try {
            var user = _mapper.Map<User>(userDto);

            // Verify email
            var sameUser = await _context.Users
                .ProjectTo<UserPrivateReadDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Email == user.Email);

            if (sameUser == null) return NotFound("Email/Password is incorrect");

            // Verify password
            bool passwordValid = BCrypt.Net.BCrypt.Verify(user.Password, sameUser.Password);
            if (!passwordValid) return NotFound("Email/Password is incorrect");

            return Ok($"Verified: User (ID: {sameUser.UserId})");
        } catch (Exception ex) {
            _logger.LogError($"PostUserLogin(userDto) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/Users/7
    [HttpGet("{id}")]
    public async Task<ActionResult<UserReadDto>> GetUser([Required] int id) {
        try {
            var user = await _context.Users
                .ProjectTo<UserReadDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.UserId == id);

            return Ok(user);
        } catch (Exception ex) {
            _logger.LogError($"GetUser(id) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/Users/login
    [HttpGet("login")]
    public async Task<ActionResult<UserReadDto>> GetUserLogin() {
        try {
            // Check if user is logged in
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return NotFound("User is logged out");

            // Get user's data
            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            var user = await _context.Users
                .ProjectTo<UserReadDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.UserId == userId);

            return CreatedAtAction(nameof(GetUser), new { id = userId }, user);
        } catch (Exception ex) {
            _logger.LogError($"GetUserLogin() threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // PUT: api/Users
    [HttpPut]
    public async Task<IActionResult> PutUser([FromBody] UserUpdateDto userDto) {
        try {
            // Check if user is logged in
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return NotFound("User is logged out");

            // Update user
            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserId == userId);

            _mapper.Map(userDto, user);

            // Hash password
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Updated: User (ID: {userId})");
            return Ok($"Updated: User (ID: {userId})");
        } catch (Exception ex) {
            _logger.LogError($"PutUser(userDto) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // DELETE: api/Users/logout
    [HttpDelete("logout")]
    public async Task<ActionResult> DeleteUserLogout() {
        try {
            // Check if user is logged in
            var jwt = Request.Cookies["jwt"];
            if (jwt == null) return Ok("No user is logged in");

            // Log out user - delete "JWT" cookie
            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);

            Response.Cookies.Append("jwt", jwt, new CookieOptions {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.Now.AddDays(-30)
            });

            _logger.LogInformation($"Logged out: User (ID: {userId})");
            return Ok($"Logged out: User (ID: {userId})");
        } catch (Exception ex) {
            _logger.LogError($"PostUserLogout() threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}
