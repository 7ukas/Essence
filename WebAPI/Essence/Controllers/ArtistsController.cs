namespace Essence;

[Route("api/[controller]")]
[ApiController]
public class ArtistsController : Controller {
    private readonly EssenceContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<ArtistsController> _logger;

    public ArtistsController(EssenceContext context, IMapper mapper, ILogger<ArtistsController> logger) {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    // GET: api/Artists/7
    [HttpGet("{id}")]
    public async Task<ActionResult<ArtistReadDto>> GetArtist([Required] int id) {
        try {
            var artist = await _context.Artists
                .ProjectTo<ArtistReadDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id);

            return Ok(artist);
        } catch (Exception ex) {
            _logger.LogError($"GetArtist(id) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}
