using Azure.Identity;
using Essence;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("EssenceDatabaseConnection");

var logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext().CreateLogger();

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddSerilog(logger);

// Services
builder.Services.AddDbContext<EssenceContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddAutoMapper((global::System.Type)typeof(global::Essence.MapperConfiguration));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<JwtService>();

builder.Services.AddMvc()
    .AddNewtonsoftJson(
          options => {
              options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
          });

builder.Services.AddCors(options => {
    options.AddPolicy("CorsPolicy",
        builder => builder
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .WithOrigins(
            "http://localhost:3000", "https://localhost:7019/",
            "https://salmon-hill-06dac0603.2.azurestaticapps.net"
        )
    );
});

// Host
builder.Host.ConfigureLogging(logging => logging.SetMinimumLevel(LogLevel.Information));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI(options => {
        options.DocumentTitle ="Essence";
    });

}

app.UseCors("CorsPolicy");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
