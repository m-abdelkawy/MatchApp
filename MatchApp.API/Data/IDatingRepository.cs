using MatchApp.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MatchApp.API.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T entity)where T: class;
        void Delete(params object[]  id);
        void Delete<T>(T entity) where T: class;
        Task<bool> SaveAll();
        Task<IEnumerable<User>> GetUsers();
        Task<User> GetUser(int id);
    }
}
