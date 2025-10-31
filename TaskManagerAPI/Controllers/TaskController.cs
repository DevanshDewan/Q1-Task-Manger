using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Models;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public ActionResult<List<TaskItem>> GetAll() => Ok(_taskService.GetAll());

        [HttpPost]
        public ActionResult<TaskItem> Create([FromBody] TaskItem task)
        {
            var created = _taskService.Create(task);
            return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public IActionResult Update(Guid id, [FromBody] bool isCompleted)
        {
            if (!_taskService.Update(id, isCompleted))
                return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            if (!_taskService.Delete(id))
                return NotFound();
            return NoContent();
        }
    }
}
