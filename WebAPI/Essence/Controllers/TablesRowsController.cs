namespace Essence;

[Route("api/[controller]")]
[ApiController]
public class TablesRowsController : Controller {
    private readonly EssenceContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<TablesRowsController> _logger;

    public TablesRowsController(EssenceContext context, IMapper mapper, ILogger<TablesRowsController> logger) {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    // GET: api/TablesRows/
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TablesRowsReadDto>>> GetTablesRows() {
        try {
            var tablesRows = await _context.TablesRows
                .ProjectTo<TablesRowsReadDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            tablesRows = tablesRows.OrderBy(x => x.TableName).ToList();

            return Ok(tablesRows);
        } catch (Exception ex) {
            _logger.LogError($"GetTablesRows() threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/TablesRows/albums
    [HttpGet("{tableName}")]
    public async Task<ActionResult<TablesRowsReadDto>> GetTableRows(string tableName) {
        try {
            var tableRows = await _context.TablesRows
            .ProjectTo<TablesRowsReadDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.TableName == tableName);

            return Ok(tableRows);
        } catch (Exception ex) {
            _logger.LogError($"GetTableRows(talbeName) threw an exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}
