var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromSeconds(10);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

app.UseDeveloperExceptionPage();
app.UseStaticFiles();

app.UseRouting();
app.UseSession();
app.MapControllerRoute(
    name: "Login",
    pattern: "{controller=Home}/{action=Login}"
);
app.MapControllerRoute(
    name: "Index",
    pattern: "{controller=Home}/{action=Index}");

app.Run();
