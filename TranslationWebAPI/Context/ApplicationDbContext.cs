using Microsoft.EntityFrameworkCore;

using TranslationWebAPI.Models;

namespace TranslationWebAPI.Context
{
  public class ApplicationDbContext:DbContext
  {
    public ApplicationDbContext(DbContextOptions options):base(options)
    {
        
    }

    public DbSet<User> Users { get; set; }
  }
}
