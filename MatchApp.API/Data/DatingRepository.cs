using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MatchApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MatchApp.API.Data
{
    public class DatingRepository  : IDatingRepository
    {
        private readonly DataContext _ctx;

        public DatingRepository(DataContext ctx)
        {
            _ctx = ctx;
        }
        public void Add<T>(T entity) where T:class
        {
            _ctx.Add(entity);
        }

        public void Delete(params object[] id)
        {
            throw new NotImplementedException();
        }

        public void Delete<T>(T entity) where T:class
        {
            _ctx.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            User user = await _ctx.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            Photo photo = await _ctx.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _ctx.Users.Include(u => u.Photos).ToListAsync();
            return users;
        }

        public async Task<bool> SaveAll()
        {
            //savechanges() returns number of changes in database
            return await _ctx.SaveChangesAsync() >0;
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _ctx.Photos.Where(p => p.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }
    }
}
