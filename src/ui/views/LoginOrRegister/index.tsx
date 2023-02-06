import { GameLinks } from "../../components";
import useTitleBar from "../../hooks/useTitleBar";
import Login from "./Login";
import Register from "./Register";

export const ajaxErrorMsg =
	"Error connecting to server. Check your Internet connection or try again later.";

const LoginOrRegister = () => {
	useTitleBar({
		title: "Login or Register",
	});
	return (
		<>
			<div className="row">
				<div className="col-sm-12 col-md-10 col-lg-8">
					<p>Creating an account enables two features:</p>
					<ol>
						<li>
							Your achievements will be stored in the cloud. If you don't make
							an account, you can still{" "}
							<a href="/achievements">
								view your achievements from leagues in this browser
							</a>
							.
						</li>
						<li>
							You can sign up for ZenGM Gold, which removes all ads from{" "}
							<GameLinks thisGameText="this game" />.
						</li>
					</ol>
					<p>
						That's it. It won't sync your leagues across devices yet. I hope it
						will some day!
					</p>
				</div>
			</div>

			<div className="row">
				<div className="col-sm-6 col-md-5 col-lg-4 mb-4 mb-sm-0">
					<Login ajaxErrorMsg={ajaxErrorMsg} />
				</div>
				<div className="col-sm-6 col-md-5 col-lg-4">
					<Register ajaxErrorMsg={ajaxErrorMsg} />
				</div>
			</div>
		</>
	);
};

export default LoginOrRegister;
