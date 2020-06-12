using MatchApp.API.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace MatchApp.API.Data
{
    public class Seed
    {
        private readonly DataContext _ctx;

        public Seed(DataContext ctx)
        {
            _ctx = ctx;
        }

        public void SeedUsers()
         {
            string userData = File.ReadAllText("Data/UserSeedData.json");
            List<User> lstUser = JsonConvert.DeserializeObject<List<User>>(userData);

            for (int i = 0; i < lstUser.Count; i++)
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash("password", out passwordHash, out passwordSalt);

                lstUser[i].PasswordHash = passwordHash;
                lstUser[i].PasswordSalt = passwordSalt;
                lstUser[i].Username = lstUser[i].Username.ToLower();

                _ctx.Users.Add(lstUser[i]);
            }
            _ctx.SaveChanges();
        }

        public async void SeedUsersAsync()
        {
            string userData = File.ReadAllText("Data/UserSeedData.json");
            List<User> lstUser = JsonConvert.DeserializeObject<List<User>>(userData);

            for (int i = 0; i < lstUser.Count; i++)
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash("password", out passwordHash, out passwordSalt);

                lstUser[i].PasswordHash = passwordHash;
                lstUser[i].PasswordSalt = passwordSalt;
                lstUser[i].Username = lstUser[i].Username.ToLower();

                await _ctx.Users.AddAsync(lstUser[i]);
            }
            await _ctx.SaveChangesAsync();
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}
