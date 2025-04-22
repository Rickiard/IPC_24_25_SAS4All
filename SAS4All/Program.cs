var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configurar cookies
builder.Services.Configure<CookiePolicyOptions>(options =>
{
    // Define se os cookies devem ser acessados apenas via HTTPS
    options.Secure = CookieSecurePolicy.Always;

    // Define se os cookies devem ser marcados como HttpOnly
    options.HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always;

    // Define a política de consentimento para cookies não essenciais
    options.CheckConsentNeeded = context => true; // Requer consentimento do utilizador para cookies não essenciais
    options.MinimumSameSitePolicy = SameSiteMode.Strict; // Restringe o compartilhamento de cookies entre sites
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
