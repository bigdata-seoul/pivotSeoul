import com.pivotseoul.PivotSeoulApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = PivotSeoulApplication.class)
@ActiveProfiles("test")
class PivotSeoulApplicationTests {

    @Test
    void contextLoads() {
    }
}
