using Microsoft.AspNetCore.Mvc;

using System;
using System.Linq;
using System.Web;

using TranslationWebAPI.Context;
using TranslationWebAPI.Models;
using TranslationWebAPI.Utility;

namespace TranslationWebAPI.Controllers
{

  [Route("api/auth")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly ApplicationDbContext _Context;
    public AuthController(ApplicationDbContext context)
    {
      _Context = context;
    }
    [HttpPost]
    [Route("login")]
    public IActionResult Login(LoginRequest request)
    {
            var user= _Context.Users.First(x => x.Email == request.Email && x.Password == request.Password);
            if (user == null) return Unauthorized();
        return Ok( user.Email.Crypt());
    }

    [Route("signup")]
    [HttpPost]
    public IActionResult SignUp(SignUpRequestModel requestModel)
    {
      try
      {
        if (_Context.Users.Any(x => x.Email == requestModel.Email))
          throw new System.Exception("Email already in use");
        if (requestModel.Email.Length == 0)
          throw new System.Exception("Please provide email");
        if (requestModel.Password.Length < 8)
          throw new System.Exception("Password must be greater than 7 characters");
        _Context.Users.Add(new Models.User
        {
          Name = requestModel.Name,
          Email = requestModel.Email,
          Password = requestModel.Password,
          IsActive = true,
          CreatedAt = DateTime.UtcNow
        });
        _Context.SaveChanges();
        return Ok(requestModel.Email.Crypt());
      }
      catch (Exception exception) { return StatusCode(500, exception.Message); }
    }
  }
}
