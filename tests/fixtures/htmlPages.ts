/**
 * HTML page templates for testing
 */
export const HTML_PAGES = {
  /**
   * Login form page
   */
  loginForm: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Form</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 400px;
          margin: 50px auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .login-container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: #555;
          font-weight: bold;
        }
        input[type="text"], input[type="email"], input[type="password"] {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          box-sizing: border-box;
        }
        .login-button {
          width: 100%;
          padding: 12px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .login-button:hover {
          background-color: #0056b3;
        }
        .remember-me {
          margin: 20px 0;
        }
        .remember-me input {
          margin-right: 8px;
        }
        #login-result {
          margin-top: 20px;
          padding: 10px;
          border-radius: 4px;
          display: none;
        }
        .success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <h1>🔐 Login to Your Account</h1>
        <form id="login-form">
          <div class="form-group">
            <label for="username">Username or Email</label>
            <input type="text" id="username" name="username" placeholder="Enter your username or email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required>
          </div>
          
          <div class="remember-me">
            <label>
              <input type="checkbox" id="remember-me" name="remember"> Remember me
            </label>
          </div>
          
          <button type="submit" class="login-button" id="login-btn">Sign In</button>
        </form>
        
        <div id="login-result"></div>
      </div>
      
      <script>
        document.getElementById('login-form').addEventListener('submit', function(e) {
          e.preventDefault();
          
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
          const remember = document.getElementById('remember-me').checked;
          const result = document.getElementById('login-result');
          
          // Simple validation demo
          if (username && password) {
            result.className = 'success';
            result.textContent = \`Login successful! Welcome, \${username}\`;
            result.style.display = 'block';
          } else {
            result.className = 'error';
            result.textContent = 'Please fill in all required fields.';
            result.style.display = 'block';
          }
        });
      </script>
    </body>
    </html>
  `,

  /**
   * Basic form page
   */
  basicForm: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Basic Form</title>
    </head>
    <body>
      <h1>Basic Form Test</h1>
      <form id="basic-form">
        <input type="text" id="name" placeholder="Enter name" />
        <input type="email" id="email" placeholder="Enter email" />
        <button type="submit" id="submit-btn">Submit</button>
      </form>
      <div id="result"></div>
    </body>
    </html>
  `,

  /**
   * Complex form page (for future expansion)
   */
  complexForm: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Complex Form</title>
    </head>
    <body>
      <h1>Complex Form Test</h1>
      <form id="complex-form">
        <select id="country">
          <option value="">Select Country</option>
          <option value="us">United States</option>
          <option value="jp">Japan</option>
          <option value="uk">United Kingdom</option>
        </select>
        <input type="radio" id="male" name="gender" value="male">
        <label for="male">Male</label>
        <input type="radio" id="female" name="gender" value="female">
        <label for="female">Female</label>
        <textarea id="comments" placeholder="Comments"></textarea>
        <button type="submit" id="submit-complex">Submit Complex Form</button>
      </form>
    </body>
    </html>
  `
};