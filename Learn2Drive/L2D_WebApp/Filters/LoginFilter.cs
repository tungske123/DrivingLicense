using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Driving_License.Filters
{
    public class LoginFilter : ActionFilterAttribute
    {
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            //Before action executing
            var session = context.HttpContext.Session;
            var usersession = session.GetString("usersession");
            if (string.IsNullOrEmpty(usersession))
            {
                context.Result = new RedirectResult("/Login");
                return;
            }
            await base.OnActionExecutionAsync(context, next);
            //After action executing
        }
    }
}